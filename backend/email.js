const { readBackendEnv } = require("./env");
const { createSupabaseAdminClient } = require("./supabase");

const STAGING_EMAIL_RECIPIENT = process.env.EMAIL_TEST_RECIPIENT || "";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

function emailButton(label, href) {
  if (!href) return "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 30px 0 4px;">
      <tr>
        <td style="border-radius: 999px; background: #111111;">
          <a href="${escapeHtml(href)}" style="display: inline-block; padding: 15px 22px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function detailRows(rows = []) {
  const visibleRows = rows.filter((row) => row?.value !== undefined && row?.value !== null && String(row.value).trim());
  if (!visibleRows.length) return "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 26px; border: 1px solid #e8e8e8; border-radius: 5px; overflow: hidden; background: #ffffff;">
      ${visibleRows.map((row) => `
        <tr>
          <td style="padding: 15px 18px; border-bottom: 1px solid #eeeeee; background: #fafafa; width: 38%; font-family: Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #8a8a8a;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding: 15px 18px; border-bottom: 1px solid #eeeeee; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; color: #111111;">
            ${escapeHtml(row.value)}
          </td>
        </tr>
      `).join("")}
    </table>
  `;
}

function emailLayout({ eyebrow, title, intro, body = "", ctaLabel, ctaUrl, footerNote }) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${escapeHtml(title || "Event Sphere")}</title>
      </head>
      <body style="margin: 0; padding: 0; background: #f3f4f1;">
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
          ${escapeHtml(intro || title || "Event Sphere notification")}
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background: #f3f4f1; padding: 34px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 660px; overflow: hidden; border: 1px solid #e4e4e0; border-radius: 5px; background: #ffffff; box-shadow: 0 18px 50px rgba(17,17,17,0.06);">
                <tr>
                  <td style="padding: 24px 30px 20px; border-bottom: 1px solid #eeeeee; background: linear-gradient(135deg, #ffffff 0%, #fbfaf6 100%);">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                      <tr>
                        <td>
                          <div style="display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #111111; color: #ffffff; font-family: Arial, sans-serif; font-size: 15px; font-weight: 800; line-height: 34px; text-align: center;">E</div>
                          <span style="margin-left: 10px; font-family: Arial, sans-serif; font-size: 14px; font-weight: 800; letter-spacing: -0.02em; color: #111111; vertical-align: 10px;">EVENT SPHERE</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 38px 30px 34px;">
                    ${eyebrow ? `<div style="margin-bottom: 14px; font-family: Arial, sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #8a8a8a;">${escapeHtml(eyebrow)}</div>` : ""}
                    <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 30px; line-height: 1.12; letter-spacing: -0.045em; color: #111111;">${escapeHtml(title || "Event Sphere")}</h1>
                    ${intro ? `<p style="margin: 18px 0 0; max-width: 540px; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #555555;">${escapeHtml(intro)}</p>` : ""}
                    ${emailButton(ctaLabel, ctaUrl)}
                    ${body}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 22px 30px; border-top: 1px solid #eeeeee; background: #fafafa;">
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #777777;">
                      ${escapeHtml(footerNote || "This email was sent by Event Sphere. During staging, email delivery may use a temporary verified sender until the production domain is connected.")}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function reviewRequestTemplate(payload) {
  const reviewLink = `${normalizeBaseUrl(payload.appBaseUrl)}/listing/${payload.vendorSlug || ""}`;
  const vendorName = payload.vendorName || "your vendor";
  const eventType = payload.eventType || "booked event";
  const body = detailRows([
    { label: "Vendor", value: vendorName },
    { label: "Event", value: eventType },
    { label: "Client", value: payload.clientName || "Client" }
  ]);

  return {
    subject: `Review request from ${vendorName}`,
    text: [
      `Hi ${payload.clientName || "there"},`,
      "",
      `Thanks for working with ${vendorName}.`,
      `Please leave a review for your ${eventType} experience.`,
      "",
      `Open review page: ${reviewLink}`
    ].join("\n"),
    html: emailLayout({
      eyebrow: "Client review",
      title: "Share your experience",
      intro: `Hi ${payload.clientName || "there"}, ${vendorName} invited you to leave a review for your ${eventType} experience.`,
      ctaLabel: "Open review page",
      ctaUrl: reviewLink,
      body
    })
  };
}

function vendorApprovalTemplate(payload) {
  const loginUrl = payload.loginUrl || `${normalizeBaseUrl(payload.appBaseUrl)}/vendor`;
  const hasTemporaryPassword = Boolean(payload.temporaryPassword);
  const body = detailRows([
    { label: "Vendor", value: payload.vendorName || "Approved vendor" },
    { label: "Portal", value: loginUrl },
    ...(hasTemporaryPassword ? [{ label: "Temporary password", value: payload.temporaryPassword }] : [])
  ]);

  return {
    subject: "Your Event Sphere listing has been approved",
    text: [
      `Hi ${payload.vendorName || "there"},`,
      "",
      "Your listing has been approved and is ready in Event Sphere.",
      hasTemporaryPassword ? "Your vendor portal access has now been enabled." : "Your vendor portal access is active.",
      "",
      `Vendor login: ${loginUrl}`,
      hasTemporaryPassword ? `Temporary password: ${payload.temporaryPassword}` : "Use your existing password to sign in.",
      hasTemporaryPassword ? "You can change this password after signing in." : ""
    ].join("\n"),
    html: emailLayout({
      eyebrow: "Application approved",
      title: "Your listing is approved",
      intro: hasTemporaryPassword
        ? "Your vendor portal access has been enabled. Use the temporary password below to sign in."
        : "Your vendor portal access is active. You can now sign in to manage your workspace.",
      ctaLabel: "Open vendor portal",
      ctaUrl: loginUrl,
      body,
      footerNote: "For security, change your temporary password after signing in. This staging email sender will be updated once the production domain is verified."
    })
  };
}

function vendorRejectionTemplate(payload) {
  const body = detailRows([
    { label: "Vendor", value: payload.vendorName || "Vendor" },
    { label: "Reason", value: payload.rejectionReason || "Updates required before approval" }
  ]);

  return {
    subject: "Your Event Sphere listing needs updates",
    text: [
      `Hi ${payload.vendorName || "there"},`,
      "",
      "Your listing was reviewed and is not approved yet.",
      payload.rejectionReason ? `Reason: ${payload.rejectionReason}` : ""
    ].filter(Boolean).join("\n"),
    html: emailLayout({
      eyebrow: "Application update",
      title: "Your listing needs updates",
      intro: "Your application was reviewed and needs a few updates before it can be approved.",
      body
    })
  };
}

function vendorApplicationSubmittedAdminTemplate(payload) {
  const vendorName = payload.vendorName || "New vendor application";
  const body = detailRows([
    { label: "Business", value: vendorName },
    { label: "Applicant", value: payload.applicantName || payload.ownerName || "Not provided" },
    { label: "Category", value: payload.category || "Not provided" },
    { label: "City", value: payload.city || "Not provided" },
    { label: "Email", value: payload.email || "Not provided" },
    { label: "Submitted", value: payload.submittedAt || "Just now" }
  ]);

  return {
    subject: `New vendor application: ${vendorName}`,
    text: [
      "A new vendor application was submitted.",
      "",
      `Business: ${vendorName}`,
      `Applicant: ${payload.applicantName || payload.ownerName || "Not provided"}`,
      `Category: ${payload.category || "Not provided"}`,
      `City: ${payload.city || "Not provided"}`,
      `Email: ${payload.email || "Not provided"}`
    ].join("\n"),
    html: emailLayout({
      eyebrow: "Vendor application",
      title: "New vendor application request",
      intro: `${vendorName} submitted a new application for admin review.`,
      body
    })
  };
}

function supportRequestCreatedAdminTemplate(payload) {
  const subjectLabel = payload.subject || payload.category || "Support request";
  const vendorLabel = payload.requester || payload.vendorName || "Vendor";
  const priorityLabel = payload.priority || "Normal";
  const emailLabel = payload.email || payload.requesterEmail || "Not provided";

  return {
    subject: `New support request: ${subjectLabel}`,
    text: [
      "A new vendor support request was submitted.",
      "",
      `Vendor: ${vendorLabel}`,
      `Subject: ${subjectLabel}`,
      `Priority: ${priorityLabel}`,
      `Email: ${emailLabel}`,
      "",
      `${payload.message || ""}`
    ].join("\n"),
    html: emailLayout({
      eyebrow: "Admin request",
      title: "New vendor support request",
      intro: `${vendorLabel} submitted a support request that needs admin review.`,
      body: `
        ${detailRows([
          { label: "Vendor", value: vendorLabel },
          { label: "Subject", value: subjectLabel },
          { label: "Priority", value: priorityLabel },
          { label: "Email", value: emailLabel }
        ])}
        ${payload.message ? `<p style="margin: 24px 0 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #555555;">${escapeHtml(payload.message)}</p>` : ""}
      `
    })
  };
}

function supportRequestStatusTemplate(payload) {
  const body = detailRows([
    { label: "Subject", value: payload.subject || "Request update" },
    { label: "Status", value: payload.status || "Updated" }
  ]) + (payload.adminReply
    ? `<div style="margin-top: 24px; padding: 18px; border: 1px solid #e5e5e5; border-radius: 5px; background: #fafafa;">
        <div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #888888;">Admin response</div>
        <p style="margin: 10px 0 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #333333;">${escapeHtml(payload.adminReply)}</p>
      </div>`
    : "");

  return {
    subject: `Support request update: ${payload.subject || "Request update"}`,
    text: [
      `Hi ${payload.requester || "there"},`,
      "",
      `Your support request status is now: ${payload.status || "Updated"}.`,
      `Subject: ${payload.subject || ""}`,
      payload.adminReply ? `Admin response: ${payload.adminReply}` : "",
      "",
      `${payload.message || ""}`
    ].filter(Boolean).join("\n"),
    html: emailLayout({
      eyebrow: "Support update",
      title: "Your support request was updated",
      intro: `Hi ${payload.requester || "there"}, your request status has been updated.`,
      body
    })
  };
}

function getEmailTemplate(eventType, payload) {
  switch (eventType) {
    case "review_request_invite":
      return reviewRequestTemplate(payload);
    case "vendor_listing_approved":
      return vendorApprovalTemplate(payload);
    case "vendor_listing_rejected":
      return vendorRejectionTemplate(payload);
    case "vendor_application_submitted_admin":
      return vendorApplicationSubmittedAdminTemplate(payload);
    case "support_request_created_admin":
      return supportRequestCreatedAdminTemplate(payload);
    case "support_request_status_updated":
      return supportRequestStatusTemplate(payload);
    default:
      return {
        subject: "Event Sphere notification",
        text: JSON.stringify(payload, null, 2),
        html: `<pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>`
      };
  }
}

async function deliverWithResend({ targetEmail, ccEmail, subject, html, text }) {
  const env = readBackendEnv();
  const ccList = String(ccEmail || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const body = {
    from: env.mailFrom,
    to: [targetEmail],
    subject,
    html,
    text
  };
  if (ccList.length) body.cc = ccList;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Resend request failed with status ${response.status}`);
  }

  return payload?.id || null;
}

async function queueEmailEvent({ eventType, targetEmail, relatedTable, relatedId, payload }) {
  if (!targetEmail) return null;

  const supabase = createSupabaseAdminClient();
  const env = readBackendEnv();
  const deliveryTargetEmail = STAGING_EMAIL_RECIPIENT || targetEmail;
  const deliveryCcEmail = !STAGING_EMAIL_RECIPIENT && targetEmail === env.adminAlertEmail ? env.adminAlertCcEmail : "";
  const template = getEmailTemplate(eventType, {
    ...payload,
    appBaseUrl: env.appBaseUrl
  });

  const insertResult = await supabase
    .from("email_events")
    .insert({
      event_type: eventType,
      target_email: targetEmail,
      related_table: relatedTable || null,
      related_id: relatedId || null,
      payload: {
        ...payload,
        intendedTargetEmail: targetEmail,
        deliveredToEmail: deliveryTargetEmail,
        deliveredCcEmail: deliveryCcEmail,
        subject: template.subject,
        text: template.text,
        html: template.html
      },
      delivery_status: env.resendApiKey ? "processing" : "queued"
    })
    .select("*")
    .single();

  if (insertResult.error) throw insertResult.error;

  const eventRow = insertResult.data;

  if (!env.resendApiKey) {
    return eventRow;
  }

  try {
    const providerMessageId = await deliverWithResend({
      targetEmail: deliveryTargetEmail,
      ccEmail: deliveryCcEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    const updateResult = await supabase
      .from("email_events")
      .update({
        delivery_status: "sent",
        provider_message_id: providerMessageId
      })
      .eq("id", eventRow.id)
      .select("*")
      .single();

    if (updateResult.error) throw updateResult.error;
    return updateResult.data;
  } catch (error) {
    const updateResult = await supabase
      .from("email_events")
      .update({
        delivery_status: "failed",
        payload: {
          ...(eventRow.payload || {}),
          deliveryError: error.message
        }
      })
      .eq("id", eventRow.id)
      .select("*")
      .single();

    if (updateResult.error) throw updateResult.error;
    return updateResult.data;
  }
}

module.exports = {
  queueEmailEvent
};
